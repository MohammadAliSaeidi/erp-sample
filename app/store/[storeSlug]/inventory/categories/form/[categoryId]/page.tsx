import { HydrationBoundary } from "@tanstack/react-query";

type EditCategoryPageProps = {
	params: Promise<{
		categoryId: string;
	}>;
};

export default async function EditCategoryPage(props: EditCategoryPageProps) {
	const { params } = props;
	const { categoryId } = await params;

     const prefetchResult = 
     
	return <div>
          <HydrationBoundary state={}>

          </HydrationBoundary>
     </div>;
}
