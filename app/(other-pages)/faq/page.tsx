import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import Faqs from "@/presentation/components/otherPages/Faqs";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

const BREADCRUMB_ITEMS: readonly BreadcrumbItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Faqs",
  },
];

export const metadata: Metadata = {
  title: "Faq || shipazoazoazos - Multipurpose React Nextjs eCommerce",
  description: "shipazoazoazos - Multipurpose React Nextjs eCommerce",
};

const Breadcrumbs = () => (
  <div className="tf-sp-3">
    <div className="container">
      <nav aria-label="Breadcrumb">
        <ul className="breakcrumbs">
          {BREADCRUMB_ITEMS.map(({ label, href }, index) => (
            <Fragment key={label}>
              <li>
                {href ? (
                  <Link href={href} className="body-small link">
                    {label}
                  </Link>
                ) : (
                  <span className="body-small">{label}</span>
                )}
              </li>
              {index < BREADCRUMB_ITEMS.length - 1 ? (
                <li className="d-flex align-items-center" aria-hidden="true">
                  <i className="icon icon-arrow-right" />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </nav>
    </div>
  </div>
);

const FaqPage = () => (
  <>
    <Header4 />
    <main>
      <Breadcrumbs />
      <Faqs />
    </main>
    <Footer1 />
  </>
);

export default FaqPage;

