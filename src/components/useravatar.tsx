"use client";
import { useTransition, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import getAccessToken from "@/helpers/getaccesstoken";
import getCsrfToken from "@/helpers/getcsrftoken";
import API from "@/lib/api";
import { FaAward } from "react-icons/fa";

interface UserData {
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  avatar?: string;
}

export function UserAvatarMenu() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState(0);
  // const [redeemMessage, setRedeemMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getuser/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // get reward points logic
  useEffect(() => {
    console.log("userData", userData);
    const fetchPoints = async () => {
      const res = await API.get("rewards/getRewardPoints/", {

      })
      setPoints(res.data.availablePoints);
    };
    if (userData?.role?.toLowerCase() === 'user') fetchPoints();
  }, [userData]);

  // const redeemPoints = async () => {
  //   const res = await API.post("rewards/rewardPoints/redeem/", {});
  //   const data = await res.data;
  //   setRedeemMessage(data.message);
  // };


  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const accessToken = await getAccessToken();
        const csrfToken = await getCsrfToken();
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout/`,
          {},
          {
            withCredentials: true,
            headers: {
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
              ...(csrfToken && { "X-CSRFToken": csrfToken }),
            },
          }
        );
        router.push("/login");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  };

  const getInitials = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
    }
    if (userData?.username) {
      return userData.username.slice(0, 2).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    if (userData?.username) {
      return userData.username;
    }
    return userData?.email || "User";
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "user":
        return "Client";
      case "vendor":
        return "Vendor";
      case "superadmin":
        return "Super Admin";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <>
      <div className="relative cursor-pointer" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-sm">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm sm:text-base">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="User avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {userData?.email}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                    {userData?.role && getRoleDisplayName(userData.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Points display */}
            {userData?.role?.toLowerCase() === 'user' && (
              <div className="px-4 py-2 text-sm text-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Badge icon */}
                  <FaAward className="text-gray-400" />
                  <span>Reward Points:</span>
                </div>
                <span className="font-semibold text-gray-800">{points}</span>
              </div>
            )}


            {/* View Profile Button */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  const profileRoute = userData?.role === 'user'
                    ? '/clientdashboard/clientprofile'
                    : userData?.role === 'vendor'
                      ? '/vendorDashboard/vendorDashboardProfile'
                      : userData?.role === 'superadmin'
                        ? '/superadmindashboard'
                        : '/profile';
                  router.push(profileRoute);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </button>

              {/* Signout Button */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowConfirmDialog(true);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl px-6 py-8 animate-fadeInUp relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out Confirmation</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to sign out from your account?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="rounded-md"
              >
                No, Stay Logged In
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleLogout();
                }}
                disabled={isPending}
                className="rounded-md bg-primary hover:bg-primary/90 text-white"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Signing out...
                  </div>
                ) : (
                  "Yes, Sign Out"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Loader while logging out */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-fadeInUp">
            <svg
              className="h-10 w-10 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-white text-sm font-medium tracking-wide">
              Signing out...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
