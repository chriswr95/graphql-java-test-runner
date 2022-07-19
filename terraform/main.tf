terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
    }
  }
}

provider "google" {
  credentials = local.cred
  project = var.project_id
  region  = var.region
  zone    = "us-central1-c"
}

locals {
  cred = file("cred.json")
  email = lookup(jsondecode(local.cred), "client_email")
}

# Define and deploy a workflow
resource "google_workflows_workflow" "test_runner_workflow" {
  name = "test-runner-workflow"
  region = var.region
  description = "Test runner workflow"
  service_account = local.email
  # Import workflow YAML file
  source_contents = file("workflow.yaml")

  depends_on = [google_project_service.workflows]
}



# Firestore
# resource "google_app_engine_application" "firestore" {
#   project = var.project_id
#   location_id = "us-central"
#   database_type = "CLOUD_FIRESTORE"

#   depends_on = [google_project_service.app_engine_api]
# }
