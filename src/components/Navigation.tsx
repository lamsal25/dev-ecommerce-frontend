import * as React from "react"
import Link from "next/link"
import { BsCart4 } from "react-icons/bs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MobileSidebar } from "./mobileSidebar"
import { getActiveCategories } from "@/app/(protected)/actions/category"
import { getUser } from "@/app/(protected)/actions/user"
import SearchBar from "./searchBar"
import { UserAvatarMenu } from "./useravatar"
import { FaRegHeart } from "react-icons/fa"

export async function Navigation() {
  // Fetch categories and user data on the server
  let categories: { id: number; name: string; image: string; slug: string }[] = []
  let user = null

  try {
    const categoriesResponse = await getActiveCategories()
    categories = categoriesResponse.data || []
  } catch (error) {
    console.error("Failed to fetch categories", error)
  }

  // Handle user authentication - getUser now returns ActionResponse, doesn't throw
  try {
    const userResponse = await getUser()
    // Check if the response indicates success (status 200) and has data
    if (userResponse.status === 200 && userResponse.data) {
      user = userResponse.data
    } else {
      // Handle 401 or other error statuses gracefully

      if (userResponse.status !== 401) {
        user = null
      }
    }
  } catch (error: any) {
    // This catch is for actual network/system errors, not API errors
    console.error("Failed to fetch user data", error)
    user = null
  }

  return (
    <>
      <div className="block lg:hidden container m-auto px-6 py-4">
        <MobileSidebar />
      </div>

      <div className="container m-auto hidden lg:flex justify-between items-center px-6 gap-x-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 py-1">
          <Image src='/logo.png' alt="Logo" height={80} width={80} />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu >
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-6 w-[650px]">
                  {categories?.length > 0 ? (
                    categories.slice(0, 10).map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-3 group p-2 rounded-lg hover:bg-gray-50 transition-all duration-100"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <Image
                            src={category.image || '/placeholder-product.jpg'}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/categories/${category.slug}-${category.id}`}
                            className="text-secondary font-medium group-hover:text-primary transition-colors"
                          >
                            {category.name}
                          </Link>
                          <p className="text-gray-500 text-xs">
                            Explore products in {category.name}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2 p-4">No categories available</p>
                  )}
                </div>
              </NavigationMenuContent>

            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/aboutUs" legacyBehavior passHref>
                <NavigationMenuLink className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>


            {/* Direct link to categories */}
            {categories
              .filter(cat => ["laptops", "electronics", "appliance", "education"].includes(cat.slug))
              .map((category) => (
                <NavigationMenuItem key={category.id}>
                  <Link
                    href={`/categories/${category.slug}-${category.id}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                      {category.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

            <NavigationMenuItem>
              <Link href="/faq" legacyBehavior passHref>
                <NavigationMenuLink className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className="px-3 py-2 text-gray-800 text-base font-medium hover:text-primary hover:bg-gray-50 rounded-md transition-all duration-200">
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {user && user.role === 'user' && (
          <div className=" flex gap-4 w-4 h-4 mr-8">
            <Link href={'/cart'}> <BsCart4 /></Link>
            <Link href={'/wishlist'}> <FaRegHeart /> </Link>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-x-6">
          <SearchBar />

        </div>

        {/* Conditional Authentication Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            // Logged-in state
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Welcome,{" "}
                  <span className="font-semibold text-primary">
                    {user.username || user.email.split("@")[0]}
                  </span>
                </span>
                {user.avatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/50">
                    <img
                      src={user.avatar}
                      alt={user.name || "User avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <UserAvatarMenu />
            </div>
          ) : (
            // Guest state
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 transition-all hover:bg-gray-100 hover:shadow-sm dark:hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/usertype">
                <Button className="rounded-full px-4 py-2 transition-all hover:shadow-md">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}