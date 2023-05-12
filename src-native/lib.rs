use napi_derive::napi;

#[napi]
#[allow(dead_code)]
fn add(x: i32, y: i32) -> i32 {
    x + y
}
