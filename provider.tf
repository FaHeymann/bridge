terraform {
  required_version = ">=0.12.21"
  backend "s3" {
    bucket = "fh-terraform-states"
    key    = "bridge"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}
