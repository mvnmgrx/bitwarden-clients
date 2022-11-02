import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BillingHistoryViewComponent } from "./billing-history-view.component";
import { PaymentMethodComponent } from "./payment-method.component";
import { PremiumComponent } from "./premium.component";
import { SubscriptionComponent } from "./subscription.component";
import { UserSubscriptionComponent } from "./user-subscription.component";

const routes: Routes = [
  {
    path: "",
    component: SubscriptionComponent,
    data: { titleId: "subscription" },
    children: [
      { path: "", pathMatch: "full", redirectTo: "premium" },
      {
        path: "user-subscription",
        component: UserSubscriptionComponent,
        data: { titleId: "premiumMembership" },
      },
      {
        path: "premium",
        component: PremiumComponent,
        data: { titleId: "goPremium" },
      },
      {
        path: "payment-method",
        component: PaymentMethodComponent,
        data: { titleId: "paymentMethod" },
      },
      {
        path: "billing-history",
        component: BillingHistoryViewComponent,
        data: { titleId: "billingHistory" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
