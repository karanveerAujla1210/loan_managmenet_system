locals {
  common_tags = {
    Environment = var.environment
    Project     = "LoanCRM"
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }

  app_name = "loan-crm"
}
