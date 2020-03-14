data "aws_iam_policy_document" "bridge-allow-logging" {
  statement {
    actions   = ["logs:*"]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "bridge-allow-dynamodb" {
  statement {
    actions   = ["logs:*"]
    resources = ["*"]
  }

  statement {
    actions   = ["dynamodb:*"]
    resources = [aws_dynamodb_table.bridge.arn]
  }
}

module "list_shopping_items" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = aws_api_gateway_rest_api.bridge.root_resource_id
  path_part                          = "shopping-list"
  http_method                        = "GET"
  lambda_name                        = "bridge-list-shopping-list"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-logging.json
  lambda_source_dir                  = "${path.module}/lambda/list-shopping-list"
  lambda_environment = {
    AUTH_TOKEN                       = var.auth_token
    TODOIST_API_TOKEN                = var.todoist_api_token
    TODOIST_SHOPPING_LIST_PROJECT_ID = var.todoist_shopping_list_project_id
  }
}

module "new_shopping_items" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = module.list_shopping_items.aws_api_gateway_resource_id
  path_part                          = "new"
  http_method                        = "POST"
  lambda_name                        = "bridge-new-shopping-item"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-logging.json
  lambda_source_dir                  = "${path.module}/lambda/new-shopping-item"
  lambda_environment = {
    AUTH_TOKEN                       = var.auth_token
    TODOIST_API_TOKEN                = var.todoist_api_token
    TODOIST_SHOPPING_LIST_PROJECT_ID = var.todoist_shopping_list_project_id
  }
}

module "list_overdue_todos" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = aws_api_gateway_rest_api.bridge.root_resource_id
  path_part                          = "overdue-todos"
  http_method                        = "GET"
  lambda_name                        = "bridge-list-overdue-todos"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-logging.json
  lambda_source_dir                  = "${path.module}/lambda/list-overdue-todos"
  lambda_environment = {
    AUTH_TOKEN        = var.auth_token
    TODOIST_API_TOKEN = var.todoist_api_token
  }
}

module "close_overdue_todo" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = module.list_overdue_todos.aws_api_gateway_resource_id
  path_part                          = "close"
  http_method                        = "POST"
  lambda_name                        = "bridge-close-overdue-todo"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-logging.json
  lambda_source_dir                  = "${path.module}/lambda/close-overdue-todo"
  lambda_environment = {
    AUTH_TOKEN        = var.auth_token
    TODOIST_API_TOKEN = var.todoist_api_token
  }
}

module "mark_venting_done" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = aws_api_gateway_rest_api.bridge.root_resource_id
  path_part                          = "venting-done"
  http_method                        = "POST"
  lambda_name                        = "bridge-mark-venting-done"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-dynamodb.json
  lambda_source_dir                  = "${path.module}/lambda/mark-venting-done"
  lambda_environment = {
    AUTH_TOKEN = var.auth_token
  }
}

module "is_venting_done" {
  source = "./modules/lambda_route"

  api_gateway_rest_api_id            = aws_api_gateway_rest_api.bridge.id
  api_gateway_rest_api_execution_arn = aws_api_gateway_rest_api.bridge.execution_arn
  api_gateway_resource_parent_id     = aws_api_gateway_rest_api.bridge.root_resource_id
  path_part                          = "venting"
  http_method                        = "GET"
  lambda_name                        = "bridge-is-venting-done"
  lambda_policy                      = data.aws_iam_policy_document.bridge-allow-dynamodb.json
  lambda_source_dir                  = "${path.module}/lambda/is-venting-done"
  lambda_environment = {
    AUTH_TOKEN = var.auth_token
  }
}
