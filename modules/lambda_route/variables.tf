variable "api_gateway_rest_api_id" {}

variable "api_gateway_rest_api_execution_arn" {}

variable "api_gateway_resource_parent_id" {}

variable "path_part" {}

variable "http_method" {}

variable "lambda_name" {}

variable "lambda_policy" {}

variable "lambda_source_dir" {}

variable "lambda_timeout" {
  type    = number
  default = 60
}

variable "lambda_environment" {
  type    = map(string)
  default = {}
}
