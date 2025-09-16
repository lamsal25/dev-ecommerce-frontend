
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Menu, LayoutDashboard, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getActiveCategories } from "@/app/(protected)/actions/category";
import { UserAvatarMenu } from "./useravatar";
import { getUser } from "@/app/(protected)/actions/user";

type Category = { id: number; name: string; image: string; slug: string }

export async function MobileSidebar() {
  let user = null;
  let categories:  Category[] = [];

  try {
      const categoriesResponse = await getActiveCategories()
      categories = categoriesResponse.data || []
    } catch (error) {
      console.error("Failed to fetch categories", error)
    }

  try {
    const userResponse = await getUser();
    if (userResponse.status === 200 && userResponse.data) {
      user = userResponse.data;
    }
  } catch (error) {
    console.error("Failed to fetch user data", error);
    user = null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={24} className="text-gray-700" />
      </SheetTrigger>
      <SheetContent className="bg-white border-l-0 overflow-y-auto pb-20 p-6" side="right">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={'/logo.png'} alt="Logo" width={60} height={60} />
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* User Section - Updated for better mobile display */}
        <div className="flex items-center justify-between mb-6">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user.username || user.email.split("@")[0]}
                </span>
                <span className="text-xs text-gray-500">
                  {user.role ?
                    user.role.charAt(0).toUpperCase() + user.role.slice(1) :
                    "User"}
                </span>
              </div>
              <div className="ml-auto"> {/* This pushes the avatar to the right */}
                <UserAvatarMenu />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <Link href="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-full px-4 py-2"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/usertype" className="flex-1">
                <Button className="w-full rounded-full px-4 py-2">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Rest of the sidebar content remains the same */}
        <Accordion type="single" collapsible className="w-full text-gray-700">
          {/* Home Section */}
          <AccordionItem value="home">
            <AccordionTrigger className="text-base py-3">Home</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-4">
                <Link href="/" className="flex items-center gap-x-3 text-secondary/80 hover:text-primary">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Categories Section */}
          <AccordionItem value="categories">
            <AccordionTrigger className="text-base py-3">Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-4">
                {categories?.length > 0 ? (
                  categories.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-x-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        <Image
                          src={category.image || '/placeholder-product.jpg'}
                          alt={category.name}
                           width={24}
                            height={24}
                          className="object-cover w-full h-full"
                        />
                      </div>
                       <Link
                            href={`/categories/${category.slug}-${category.id}`}
                            className="text-secondary font-medium group-hover:text-primary transition-colors"
                          >
                            {category.name}
                          </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* About Section */}
          <AccordionItem value="about">
            <AccordionTrigger className="text-base py-3">About</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <Link href="/about" className="block text-secondary/80 hover:text-primary">About Us</Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contact Section */}
          <AccordionItem value="contact">
            <AccordionTrigger className="text-base py-3">Contact</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                <Link href="/contact" className="block text-secondary/80 hover:text-primary">Contact Us</Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Information */}
        <div className="flex flex-col gap-2 items-center justify-center mt-8 text-gray-700 border-t pt-4">
          <Link href="mailto:inquiry@goingcollege.com">
            <span className="text-sm">inquiry@dcart.com</span>
          </Link>
          <p className="text-gray-500/80 text-sm">© inquiry@dcart.com | 2025</p>
          <div className="flex items-center gap-1 text-xs">
            <Link href="tel:+977-9851014902">9851014902</Link>
            <span>|</span>
            <Link href="tel:+977-9807438831">9807438831</Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}