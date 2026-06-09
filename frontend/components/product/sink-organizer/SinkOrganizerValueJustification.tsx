"use client";

import { CroProductValueJustification } from "@/components/product/cro/CroProductValueJustification";
import { getCroProductPage } from "@/config/cro-product-pages";

/** @deprecated Use CroProductValueJustification */
export function SinkOrganizerValueJustification() {
  return (
    <CroProductValueJustification
      section={getCroProductPage("sink-organizer").valueJustification}
    />
  );
}
