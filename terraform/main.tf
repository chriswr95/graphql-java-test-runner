terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

locals {
  cred  = file("cred.json")
  email = lookup(jsondecode(local.cred), "client_email")
}

provider "google" {
  credentials = local.cred
  project     = var.project_id
  region      = var.region
  zone        = "us-central1-c"
}

# Define and deploy a workflow
resource "google_workflows_workflow" "test_runner_workflow" {
  name            = "test-runner-workflow"
  region          = var.region
  description     = "Test runner workflow"
  service_account = local.email
  source_contents = file("workflow.yaml")

  depends_on = [google_project_service.workflows]
}

# Define and deploy a tasks queue
# Queue should not be named the same as any other queue created 7 days before within the same GCP account. It will throw an error.
resource "google_cloud_tasks_queue" "test_runner_tasks_queue" {
  name     = "test-runner-tasks-queue-v1"
  location = var.region

  rate_limits {
    max_concurrent_dispatches = 1
  }

  retry_config {
    max_attempts = 1
  }

  depends_on = [google_project_service.cloud_tasks_api]
}

# Enable Firestore, this operation will be successful when initializing
# the project for the first time. Firestore once enabled can never be disabled on the same project.
# If terraform apply is called multiple times for the same project it's ok to get the below error for firestore.
# Error 409: This application already exists and cannot be re-created.
resource "google_app_engine_application" "firestore" {
  project       = var.project_id
  location_id   = "us-central"
  database_type = "CLOUD_FIRESTORE"

  depends_on = [google_project_service.app_engine_api]
}

resource "google_compute_firewall" "rules" {
  project     = var.project_id
  name        = "allow-http-firewall-rule"
  network     = "default"
  description = "Creates firewall rule targeting tagged instances"

  allow {
    protocol = "tcp"
    ports    = ["80", "8080", "1000-2000"]
  }
  source_ranges=["0.0.0.0/0"]
  target_tags = ["web"]
}
