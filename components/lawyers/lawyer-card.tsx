"use client";

import { MapPin, BadgeCheck, Award, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Lawyer } from "@/types";
import { getSubtypeById } from "@/data/case-types";
import { cn } from "@/lib/utils";
import BackgroundPattern from "@/components/ui/BackgroundPattern";

interface LawyerCardProps {
  lawyer: Lawyer;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const fullName = `${lawyer.firstName} ${lawyer.lastName}`;
  const initials = `${lawyer.firstName[0]}${lawyer.lastName[0]}`;

  // Get first 3 specialization names
  const specializationNames = lawyer.specializations
    .slice(0, 3)
    .map((spec) => {
      const result = getSubtypeById(spec.subtypeId);
      return result?.subtype.nameTh || "";
    })
    .filter(Boolean);

  // Get first 2 service areas
  const serviceAreaNames = lawyer.serviceAreas
    .slice(0, 2)
    .map((area) => area.nameTh);

  // Calculate filled icons: 1 icon per 2 years, max 5 icons (≥10 years = full)
  const filledIcons = Math.min(5, Math.ceil(lawyer.experienceYears / 2));
  const isNationwide =
    lawyer.isNationwide || (lawyer.serviceAreas?.length ?? 0) >= 77;

  return (
    <div className="h-full pt-4 px-2 pb-2">
      <div
        className={cn(
          "group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border",
          lawyer.isRecommended
            ? "border-yellow-400/50 shadow-yellow-100 ring-2 ring-yellow-400/20"
            : "border-slate-100",
        )}
      >
        {/* Top Cover Section */}
        <div
          className={cn(
            "relative h-28 overflow-hidden",
            lawyer.isRecommended
              ? "bg-gradient-to-r from-[#1a237e] to-[#4a148c]"
              : "bg-gradient-to-r from-slate-700 to-slate-800",
          )}
        >
          {/* Background Pattern */}
          <BackgroundPattern variant="navy" className="opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Active Status Badge (Top Left) */}
          <div className="absolute top-4 left-4 flex gap-2">
            {lawyer.isAvailable ? (
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-medium text-white">ว่าง</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                <span className="text-[10px] font-medium text-white">
                  ไม่ว่าง
                </span>
              </div>
            )}

            {/* Optional Recommended Text Badge */}
            {lawyer.isRecommended && (
              <div className="flex items-center gap-1.5 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/50 px-2.5 py-1 rounded-full">
                <Award className="w-3 h-3 text-yellow-300" />
                <span className="text-[10px] font-bold text-yellow-100">
                  แนะนำ
                </span>
              </div>
            )}
          </div>

          {/* Follow/Consult Button (Top Right) */}
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "h-8 rounded-full text-xs font-medium shadow-sm border-0 gap-1",
                lawyer.isRecommended
                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 hover:from-yellow-400 hover:to-yellow-600"
                  : "bg-white/90 hover:bg-white text-navy-dark",
              )}
              asChild
            >
              <a href={`/booking?lawyer=${lawyer.id}`}>
                ปรึกษา <Plus className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Avatar & Header Content */}
        <div className="px-6 relative">
          <div className="flex items-end justify-between -mt-10 mb-4 align-bottom">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                className={cn(
                  "w-20 h-20 rounded-full shadow-md",
                  lawyer.isRecommended
                    ? "ring-4 ring-yellow-400"
                    : "ring-4 ring-white",
                )}
              >
                <AvatarImage
                  src={lawyer.profileImageUrl}
                  alt={fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Crown/Verified Icon on Avatar */}
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 p-1 rounded-full ring-2 ring-white",
                  lawyer.isRecommended
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-blue-500 text-white",
                )}
              >
                {lawyer.isRecommended ? (
                  <Award className="w-3 h-3" />
                ) : (
                  <Award className="w-3 h-3" />
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="flex flex-col items-end gap-1 justify-end -translate-y-[24px]">
              <div className="flex items-end gap-1.5 ">
                <span className="text-sm font-medium text-white tracking-widest">
                  ประสบการณ์
                </span>
                <span className="text-base font-bold text-white">
                  {lawyer.experienceYears}
                </span>
                <span className="text-sm font-medium text-white">ปี</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < filledIcons
                        ? `/icon_0${filledIcons}.svg`
                        : "/icon_00.svg"
                    }
                    alt=""
                    className="w-5 h-5 transition-all duration-300"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-navy-dark font-display truncate">
                {fullName}
              </h3>
              <BadgeCheck
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  lawyer.isRecommended ? "text-yellow-500" : "text-blue-500",
                )}
              />
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {lawyer.bio ||
                `ทนายความผู้เชี่ยวชาญด้าน${specializationNames.join(", ")}`}
            </p>
          </div>
        </div>

        {/* Bottom Actions / Info */}
        <div className="p-6 mt-auto">
          {/* Specialization Tags */}
          <div className="flex flex-wrap gap-2 mb-6 max-h-[97px] overflow-hidden">
            {specializationNames.map((name, i) => (
              <span
                key={i}
                className={cn(
                  "text-[11.5px] font-medium px-[9px] py-[5px] rounded-md border",
                  lawyer.isRecommended
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-blue-50 text-blue-600 border-blue-100",
                )}
              >
                {name}
              </span>
            ))}
            {isNationwide ? (
              <span className="text-[11.5px] font-medium px-[9px] py-[5px] rounded-md bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                <MapPin className="w-[14px] h-[14px]" />
                ทั่วประเทศ
              </span>
            ) : (
              serviceAreaNames.length > 0 && (
                <span className="text-[11.5px] font-medium px-[9px] py-[5px] rounded-md bg-gray-50 text-gray-600 border border-gray-100 flex items-center gap-1">
                  <MapPin className="w-[14px] h-[14px]" />
                  {serviceAreaNames[0]}
                </span>
              )
            )}
          </div>

          {/* Footer Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <Button
              asChild
              variant="outline"
              className={cn(
                "col-span-1 rounded-2xl h-12 transition-all p-0",
                lawyer.isRecommended
                  ? "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700"
                  : "border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary",
              )}
            >
              <a href={`/lawyers/${lawyer.id}`}>
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              className={cn(
                "col-span-3 rounded-2xl h-12 shadow-lg transition-all duration-300 text-base font-semibold",
                lawyer.isRecommended
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-500/30 text-white"
                  : "bg-primary hover:bg-primary-dark shadow-blue-500/20",
              )}
            >
              <a href={`/booking?lawyer=${lawyer.id}`}>จองนัดหมาย</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
