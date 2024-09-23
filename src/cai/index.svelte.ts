import { initDefaultComponentRenderers } from "./cmps/index.svelte"


let initialized = false


export function initCai(){
  if (initialized) return
  // console.log("initializing cai")
  initDefaultComponentRenderers()
  initialized = true
}