// app/(protected)/actions/revalidate.ts
"use server";

import { revalidatePath } from "next/cache";

export async function revalidateCategoryPage() {
    revalidatePath('/vendorDashboard/categories');
}


