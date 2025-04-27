import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server, setupServer } from "./server";

describe("server", () => {
  it("should be converted to defineAsyncComponent", async () => {
    setupServer(server);

    const client = new Client({
      name: "test client",
      version: "0.0.1",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const output = await client.callTool({
      name: "convert-to-script-setup",
      arguments: {
        input: `<script>
import { defineComponent } from 'vue';
import HelloWorld from './HelloWorld.vue';

export default defineComponent({
  components: {
    HelloWorld,
    MyComp: () => import('./MyComp.vue'),
    Foo: () => import('./Foo.vue'),
  }
  })
  </script>`,
      },
    });
    // @ts-expect-error
    expect(output.content[0].text).toMatchInlineSnapshot(`
      "import { defineAsyncComponent } from "vue";
      import HelloWorld from './HelloWorld.vue';
      const MyComp = defineAsyncComponent(() => import('./MyComp.vue'));
      const Foo = defineAsyncComponent(() => import('./Foo.vue'));
      "
    `);
  });
});
