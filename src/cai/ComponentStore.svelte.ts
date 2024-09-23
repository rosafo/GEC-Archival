import type { IComponent, IParsedComponent } from "./types"

type IResolver = (name: string) => ConstructorOfATypedSvelteComponent

let mappers: Record<string, ConstructorOfATypedSvelteComponent> = {}
let resolvers: IResolver[] = []
export function resolveComponent(name: string) {
  // console.log("getting", name, { resolvers })
  for(let i = 0; i < resolvers.length; i++) {
    const cmp = resolvers[i](name)
    if (cmp) return cmp
  }
  return mappers[name]
}

export function addComponent(name: string, ctor: ConstructorOfATypedSvelteComponent) {
  mappers[name] = ctor
}
export function removeComponent(name: string) {
  delete mappers[name]
}

export function addComponentResolver(f: IResolver) {
  resolvers = [f, ...resolvers]
}
export function removeComponentResolver(f: IResolver) {
  resolvers = resolvers.filter(x => x != f)
}

export function parseComponent(defn: IComponent): IParsedComponent {
  return {
    props: defn.props || {},
    type: resolveComponent(defn.type),
    children: !defn.children
      ? []
      : defn.children.map(parseComponent),
    src: defn
  }
}