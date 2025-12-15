import CategoryPage from "./_components/category-page";

const page = async ({ params }: {params: Promise<{ slug: string }>}) => {
    const { slug } = await params;
  return <CategoryPage slug={slug} />
}

export default page
