workflow "New workflow" {
  on = "push"
  resolves = ["Test"]
}

action "Test" {
  uses = "actions/action-builder/shell@master"
  runs = "rake"
  args = "test"
}
