import { createStore, createEvent, sample } from "effector";
import { spec, h } from "forest";

export function app() {
  const { change, submit, state } = formModel();

  h("section", () => {
    spec({ style: { width: "15em" } });

    h("form", () => {
      spec({
        handler: { submit },
        style: {
          display: "flex",
          flexDirection: "column",
        },
      });

      h("input", {
        attr: { placeholder: "Username", name: "username" },
        handler: { input: change },
      });

      h("input", {
        attr: { type: "password", placeholder: "Password", name: "password" },
        handler: { input: change },
      });

      h("button", {
        text: "Submit",
        attr: {
          disabled: state.map(
            (values) => !(values.username && values.password)
          ),
        },
      });
    });

    h("section", () => {
      spec({ style: { marginTop: "1em" } });
      h("div", { text: "Reactive form debug:" });
      h("pre", { text: state.map(stringify) });
    });
  });
}

function formModel() {
  const state = createStore({ username: "", password: "" });
  const changed = createEvent<{ name: string; value: string }>();
  const submit = createEvent<Event>();

  state.on(changed, (data, { name, value }) => ({ ...data, [name]: value }));

  const change = changed.prepend<Event>((e) => {
    if (e.target instanceof HTMLInputElement) {
      return {
        name: e.target.name,
        value: e.target.value,
      };
    } else {
      return { name: "", value: "" };
    }
  });

  sample({
    source: state,
    clock: submit,
    fn: stringify,
  }).watch(alert);

  return { change, submit, state };
}

function stringify(values: any) {
  return JSON.stringify(values, null, 2);
}
