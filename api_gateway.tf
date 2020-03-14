resource "aws_api_gateway_rest_api" "bridge" {
  name        = "bridge"
  description = "bridge"
}

resource "aws_api_gateway_deployment" "bridge" {
  rest_api_id = aws_api_gateway_rest_api.bridge.id
  stage_name  = "bridge"
}

resource "aws_api_gateway_domain_name" "bridge" {
  domain_name     = "bridge.fheymann.de"
  certificate_arn = var.certificate_arn
}

resource "aws_route53_record" "bridge" {
  name    = aws_api_gateway_domain_name.bridge.domain_name
  type    = "A"
  zone_id = var.hosted_zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.bridge.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.bridge.cloudfront_zone_id
  }
}

resource "aws_api_gateway_base_path_mapping" "bridge" {
  api_id      = aws_api_gateway_rest_api.bridge.id
  stage_name  = aws_api_gateway_deployment.bridge.stage_name
  domain_name = aws_api_gateway_domain_name.bridge.domain_name
}

data "aws_iam_policy_document" "apigateway_logs_trust_relationship" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "apigateway_logs" {
  name               = "apigateway-logs"
  assume_role_policy = data.aws_iam_policy_document.apigateway_logs_trust_relationship.json
}

resource "aws_iam_role_policy" "apigateway_logs" {
  name   = "apigateway-logs"
  role   = aws_iam_role.apigateway_logs.id
  policy = data.aws_iam_policy_document.apigateway_logs.json
}

data "aws_iam_policy_document" "apigateway_logs" {
  statement {
    actions   = ["logs:*"]
    resources = ["*"]
  }
}

resource "aws_api_gateway_account" "demo" {
  cloudwatch_role_arn = aws_iam_role.apigateway_logs.arn
}

output "api_gateway_base_url" {
  value = aws_api_gateway_deployment.bridge.invoke_url
}
