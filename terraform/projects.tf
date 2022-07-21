# Enable cloud resource manager API, required to enable dependent API's.
resource "google_project_service" "cloud_manager_api" {
  service   = "cloudresourcemanager.googleapis.com"
}

# Enable Workflows API
resource "google_project_service" "workflows" {
  service = "workflows.googleapis.com"
  disable_dependent_services = true
  depends_on = [google_project_service.cloud_manager_api]
}

# Enable AppEngine API - required to create datastore
resource "google_project_service" "app_engine_api" {
  service = "appengine.googleapis.com"
  disable_dependent_services = true
  depends_on = [google_project_service.cloud_manager_api]
}

# Enable ComputeEngine API - required to create compute engine instance
resource "google_project_service" "compute_engine_api" {
  service = "compute.googleapis.com"
  disable_dependent_services = true
  depends_on = [google_project_service.cloud_manager_api]
}

# Enable Cloud Tasks Queue API - required to create a queue
resource "google_project_service" "cloud_tasks_api" {
  service = "cloudtasks.googleapis.com"
  disable_dependent_services = true
  depends_on = [google_project_service.cloud_manager_api]
}
