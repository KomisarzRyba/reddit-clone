import CommentSection from "@/components/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import {
    ReloadIcon,
    ThickArrowDownIcon,
    ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface PageProps {
    params: {
        postId: string;
    };
}

const page = async ({ params }: PageProps) => {
    const cachedPost = (await kv.hgetall(
        `post:${params.postId}`
    )) as CachedPost;
    let post: (Post & { votes: Vote[]; author: User }) | null = null;
    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                votes: true,
                author: true,
            },
        });
    }

    if (!post && !cachedPost) return notFound();

    return (
        <div>
            <div className="flex flex-row items-start justify-between h-full">
                <Suspense fallback={<PostVoteShell />}>
                    <PostVoteServer
                        postId={post?.id ?? cachedPost.id}
                        getData={async () => {
                            return await db.post.findUnique({
                                where: {
                                    id: params.postId,
                                },
                                include: {
                                    votes: true,
                                },
                            });
                        }}
                    />
                </Suspense>
                <div className="flex-1 w-full p-4 rounded-sm sm:w-0">
                    <p className="mt-1 text-xs truncate max-h-4 text-muted-foreground">
                        Posted by u/
                        {post?.author.username ??
                            cachedPost.authorUsername}{" "}
                        {formatTimeToNow(
                            new Date(post?.createdAt ?? cachedPost.createdAt)
                        )}
                    </p>
                    <h1 className="py-2 text-xl font-semibold leading-6">
                        {post?.title ?? cachedPost.title}
                    </h1>
                    <EditorOutput
                        content={post?.content ?? cachedPost.content}
                    />
                    <Suspense
                        fallback={
                            <ReloadIcon className="w-5 h-5 animate-spin text-muted-foreground" />
                        }
                    >
                        <CommentSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

const PostVoteShell = () => {
    return (
        <div className="flex flex-col items-center w-20 pr-6">
            <div className={buttonVariants({ variant: "ghost" })}>
                <ThickArrowUpIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="py-2 text-sm font-medium text-center">
                <ReloadIcon className="w-3 h-3 animate-spin" />
            </div>
            <div className={buttonVariants({ variant: "ghost" })}>
                <ThickArrowDownIcon className="w-5 h-5 text-muted-foreground" />
            </div>
        </div>
    );
};

export default page;
