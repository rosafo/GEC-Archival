import { get, writable } from "svelte/store";
import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";

//TODO - make work if the zone is defined and handle isn't or show clear error (?)
const drag = writable(true);

export  function dragHandleZone(node, options) {
      let currentOptions = options;
      const zone = dndzone(node, {
        ...currentOptions,
        dragDisabled: true,
      });

      drag.subscribe((disabled) => {
        zone.update({
          ...currentOptions,
          dragDisabled: disabled,
        });
      });
      function consider(e) {
        const {
          info: { source, trigger },
        } = e.detail;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
          drag.set(true);
        }
      }

      function finalize(e) {
        const {
          info: { source },
        } = e.detail;
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
          drag.set(true);
        }
      }

      node.addEventListener("consider", consider);
      node.addEventListener("finalize", finalize);

      return {
        update: (newOptions) => {
          currentOptions = newOptions;
          zone.update({
            ...currentOptions,
            dragDisabled: get(drag),
          });
        },
        destroy: () => {
          node.removeEventListener("consider", consider);
          node.removeEventListener("finalize", finalize);
        },
      };
    }

    export function dragHandle(node) {
      function startDrag(e) {
        // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
        e.preventDefault();
        drag.set(false);
      }
      function handleKeyDown(e) {
        if (e.key === "Enter" || e.key === " ") drag.set(false);
      }

      drag.subscribe((disabled) => {
        node.tabIndex = disabled ? 0 : -1;
        node.style.cursor = disabled ? "grab" : "grabbing";
      });

      node.addEventListener("mousedown", startDrag);
      node.addEventListener("touchstart", startDrag);
      node.addEventListener("keydown", handleKeyDown);
      return {
        update: () => {},
        destroy: () => {
          node.removeEventListener("mousedown", startDrag);
          node.removeEventListener("touchstart", startDrag);
          node.removeEventListener("keydown", handleKeyDown);
        },
      };
    }