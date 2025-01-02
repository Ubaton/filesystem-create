export const proStructure = {
  computer_store: `src/
  app/
    layout
    page
    loading
    error
    not-found
    (auth)/
      login/
        page
      register/
        page
      layout
    (shop)/
      products/
        page
        loading
        [productId]/
          page
          layout
      categories/
        page
        [categoryId]/
          page
      layout
    (checkout)/
      cart/
        page
      checkout/
        page
      layout
    (dashboard)/
      account/
        page
      orders/
        page
        [orderId]/
          page
      layout
    api/
      auth/
        [...nextauth]/
          route
      products/
        route
        [productId]/
          route
      orders/
        route
  components/
    ui/
      button
      input
      card
      modal
    layout/
      header
      footer
      navigation
    products/
      product-card
      product-grid
      product-filters
    checkout/
      cart-item
      payment-form
  lib/
    db/
      prisma
      schema.prisma
    utils/
      formatting
      validation
    config/
      site
  hooks/
    use-cart
    use-products
    use-search
  types/
    product
    order
    user
  public/
    images/
      products/
      banners/
    icons/
  middleware`,
  email_saas: `src/
  app/
    layoutx
    pagex
    loadingx
    errorx
    not-foundx
    (auth)/
      login/
        pagex
      register/
        pagex
      forgot-password/
        pagex
      layoutx
    (dashboard)/
      layoutx
      pagex
      campaigns/
        pagex
        loadingx
        create/
          pagex
        [campaignId]/
          pagex
          edit/
            pagex
          analytics/
            pagex
      templates/
        pagex
        create/
          pagex
        [templateId]/
          pagex
          edit/
            pagex
      subscribers/
        pagex
        import/
          pagex
        [subscriberId]/
          pagex
      analytics/
        pagex
        overview/
          pagex
        engagement/
          pagex
        deliverability/
          pagex
      settings/
        pagex
        profile/
          pagex
        team/
          pagex
        billing/
          pagex
        integrations/
          pagex
    api/
      auth/
        [...nextauth]/
          route
      campaigns/
        route
        [campaignId]/
          route
          send/
            route
      templates/
        route
        [templateId]/
          route
      subscribers/
        route
        import/
          route
        [subscriberId]/
          route
      webhooks/
        mailgun/
          route
        stripe/
          route
  components/
    ui/
      buttonx
      inputx
      selectx
      modalx
      dropdownx
      data-tablex
    email-editor/
      editorx
      toolbarx
      blocks/
        text-blockx
        image-blockx
        button-blockx
      previewx
    analytics/
      metrics-cardx
      line-chartx
      pie-chartx
      heat-mapx
    campaigns/
      campaign-cardx
      campaign-listx
      campaign-statsx
      schedule-formx
    layout/
      headerx
      sidebarx
      footerx
      navigationx
  lib/
    db/
      prisma
      schema.prisma
    email/
      send
      template-parser
      validators
    services/
      mailgun
      stripe
      analytics
    utils/
      formatting
      validation
      dates
  hooks/
    use-campaigns
    use-templates
    use-subscribers
    use-analytics
    use-pagination
  types/
    campaign
    template
    subscriber
    analytics
    user
  config/
    site
    constants
  styles/
    editor.css
    globals.css
  middleware`,
  e_commerce_dashboard: `src/
  app/
    layout
    page
    loading
    error
    (auth)/
      login/
        page
      reset-password/
        page
      layout
    (dashboard)/
      layout
      page
      products/
        page
        create/
          page
        categories/
          page
          [categoryId]/
            page
        inventory/
          page
        [productId]/
          page
          edit/
            page
          variants/
            page
      orders/
        page
        pending/
          page
        completed/
          page
        returns/
          page
        [orderId]/
          page
      customers/
        page
        segments/
          page
        [customerId]/
          page
          orders/
            page
      analytics/
        page
        sales/
          page
        inventory/
          page
        customers/
          page
      marketing/
        page
        discounts/
          page
        promotions/
          page
        abandoned-carts/
          page
      settings/
        page
        store/
          page
        shipping/
          page
        payments/
          page
        team/
          page
    api/
      products/
        route
        categories/
          route
        inventory/
          route
      orders/
        route
        stats/
          route
      analytics/
        route
  components/
    ui/
      data-table
      stats-card
      date-picker
      dropdown
      modal
    products/
      product-form
      variant-manager
      inventory-grid
      bulk-editor
    orders/
      order-list
      order-details
      status-badge
      fulfillment-form
    analytics/
      revenue-chart
      sales-overview
      inventory-reports
      customer-insights
    marketing/
      discount-form
      promotion-scheduler
      cart-recovery
    dashboard/
      sidebar
      header
      search
      notifications
  lib/
    db/
      prisma
    utils/
      currency
      dates
      calculations
    services/
      stripe
      shipping
      analytics
  hooks/
    use-orders
    use-products
    use-analytics
    use-notifications
  types/
    product
    order
    customer
    analytics
  middleware`,
  expense_tracker: `src/
  app/
    layout
    page
    loading
    error
    (auth)/
      login/
        page
      register/
        page
      reset-password/
        page
      layout
    dashboard/
      layout
      page
      expenses/
        page
        create/
          page
        edit/
          [expenseId]/
            page
        categories/
          page
          create/
            page
          [categoryId]/
            page
        reports/
          page
      income/
        page
        create/
          page
        edit/
          [incomeId]/
            page
        categories/
          page
          create/
            page
          [categoryId]/
            page
      settings/
        profile/
          page
        notifications/
          page
        preferences/
          page
    api/
      expenses/
        route
      income/
        route
      categories/
        route
      reports/
        route
  components/
    ui/
      button
      modal
      table
      dropdown
      date-picker
    expenses/
      expense-form
      expense-list
      expense-chart
    income/
      income-form
      income-list
      income-chart
    dashboard/
      sidebar
      header
      overview-cards
  lib/
    db/
      prisma
    utils/
      currency
      date-helpers
      calculations
    services/
      auth
      expenses
      income
      reports
  hooks/
    use-expenses
    use-income
    use-categories
    use-reports
  types/
    expense
    income
    category
    report
  styles/
    global.css
    components.css
    utilities.css
  middleware`,
};
