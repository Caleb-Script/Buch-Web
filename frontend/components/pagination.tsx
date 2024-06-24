'use client';

import { generatePagination } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

export default function SeitenNummerierung({ anzahlSeiten }: { anzahlSeiten: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const allPages = generatePagination(currentPage, anzahlSeiten);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="d-inline-flex gap-2">
        <SeitenPfeile
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="d-flex">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <SeitenNummer
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <SeitenPfeile
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= anzahlSeiten}
        />
      </div>
    </>
  );
}

function SeitenNummer({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const className = clsx(
    "d-flex align-items-center justify-content-center border",
    {
      "rounded-start": position === "first" || position === "single",
      "rounded-end": position === "last" || position === "single",
      "bg-danger text-white border-danger": isActive,
    }
  );

  return isActive || position === "middle" ? (
    <div
      className={`${className}`}
      style={{ width: "2.5rem" }}
    >
      {page}
    </div>
  ) : (
    <Link
      href={href}
      className={`${className} ${isHovered ? "bg-danger-subtle" : ""}`}
      style={{ transition: "background-color 0.3s", width: "2.5rem" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(false)}
    >
      {page}
    </Link>
  );
}

function SeitenPfeile({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
  }) {
  const [isHovered, setIsHovered] = useState(false);
  const className = clsx(
    'd-flex align-items-center justify-content-center rounded border',
    {
      'text-body-tertiary': isDisabled,
      'bg-light': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon style={{ width: "1.75rem" }} />
    ) : (
      <ArrowRightIcon style={{ width: "1.75rem" }} />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link
      className={`${className} ${isHovered ? "bg-success" : ""}`}
      href={href}
      style={{ transition: "background-color 0.3s"}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
    </Link>
  );
}
