# Enable Workflows API
resource "google_project_service" "workflows" {
  service = "workflows.googleapis.com"
  disable_dependent_services = true
}

# Enable AppEngine API - required to create datastore
resource "google_project_service" "app_engine_api" {
  service = "appengine.googleapis.com"
  disable_dependent_services = true
}

# Enable ComputeEngine API - required to create compute engine instance
resource "google_project_service" "compute_engine_api" {
  service = "compute.googleapis.com"
  disable_dependent_services = true
}
