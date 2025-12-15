import BlogPage from "./_components/blog-page";

const page = async ({ params }: {params: Promise<{ slug: string }>}) => {
    const { slug } = await params;
  return <BlogPage slug={slug} />
}

export default page
