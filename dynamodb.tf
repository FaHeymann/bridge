resource "aws_dynamodb_table" "bridge" {
  name         = "bridge"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "task"
  range_key    = "date"

  attribute {
    name = "task"
    type = "S"
  }

  attribute {
    name = "date"
    type = "N"
  }
}
