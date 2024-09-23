import Form from "./form.svelte"
import VStack from "./vstack.svelte"
import HStack from "./hstack.svelte"
import Datepicker from "./fields/datepicker.svelte"
import Timepicker from "./fields/timepicker.svelte"
import Grid from "./grid.svelte"
import Checkbox from "./fields/checkbox.svelte"
import Radio from "./fields/radio.svelte"
import Switch from "./fields/switch.svelte"
import Slider from "./fields/slider.svelte"
import Textinput from "./fields/textinput.svelte"
import Image from "./image.svelte"
import Button from "./button.svelte"
import Text from "./text.svelte"
import Textarea from "./fields/textarea.svelte"
import Select from "./fields/select.svelte"
import { addComponentResolver } from "$cai/ComponentStore.svelte"



const mapping: Record<string, ConstructorOfATypedSvelteComponent> = {
  form: Form, vstack: VStack, grid: Grid, hstack: HStack,
  datepicker: Datepicker, timepicker: Timepicker,
  button: Button, 
  radio: Radio, slider: Slider, image: Image, switch: Switch,
  checkbox: Checkbox, textinput: Textinput, textarea: Textarea,
  text: Text, select: Select
}
function resolver(name: string) {
  return mapping[name] || null
}


export function initDefaultComponentRenderers(){
  addComponentResolver(resolver)
}