const CustomLabelsPagination = {
  totalDocs: "total_rows",
  docs: "data",
  limit: "per_page",
  page: "current_page",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "total_pages",
  pagingCounter: "slNo",
  meta: "pagination",
};

const ServiceAccount = require("./config/firebaseServiceKey.json");
const FirebaseConfig = {
  PROJECT_ID: ServiceAccount.project_id,
  SERVICE_ACCOUNT_ID: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
  DATABASE_URL: `https://${ServiceAccount.project_id}.firebaseio.com`,
};

module.exports = {
  CUSTOM_LABELS_PAGINATION: CustomLabelsPagination,
  SERVICE_ACCOUNT: ServiceAccount,
  FIREBASE_CONFIG: FirebaseConfig,
};
