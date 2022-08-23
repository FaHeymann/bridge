terraform {
  required_version = ">=1.2"
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  backend "s3" {
    bucket = "fh-terraform-states"
    key    = "bridge"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}
