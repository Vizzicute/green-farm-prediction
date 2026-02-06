import CustomPages from "../_components/custom-pages"
import { Metadata } from 'next';
import { getPageDataBySlug } from '../_server/pagedata';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageDataBySlug("/privacy");

  return {
    title: pageData?.title || "Policy & Privacy",
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
  return <CustomPages />
}

export default page
