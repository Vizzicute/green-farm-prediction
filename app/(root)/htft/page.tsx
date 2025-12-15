import DynamicPageContent from "../_components/dynamic-page-content"
import { Metadata } from 'next';
import { getPageDataBySlug } from '../_server/pagedata';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageDataBySlug("/htft");

  return {
    description:
      pageData?.description || "Get the best football tips and predictions",
    openGraph: {
      title: pageData?.title || "",
      description:
        pageData?.description || "Get the best football tips and predictions",
      images: "/logo.jpg",
    },
    twitter: {
      description:
        pageData?.description || "Get the best football tips and predictions",
      images: "/logo.jpg",
    },
  };
}

const page = () => {
  return <DynamicPageContent />
}

export default page
