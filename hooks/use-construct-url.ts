import { env } from "@/schema/env";

export function useConstructUrl(value: string) {
    const url = `${env.NEXT_PUBLIC_S3_BUCKET_ENDPOINT_URL}/${value}`;
    return url;
}