import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const SAFE_PROTOCOLS = ["http", "https", "mailto"];

// StarterKit v3 embarque déjà l'extension Link : on la configure ici plutôt
// que d'en enregistrer une seconde (ce qui déclencherait un doublon).
export const tiptapExtensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: SAFE_PROTOCOLS,
      HTMLAttributes: { rel: "nofollow noopener noreferrer" },
      // Bloque javascript:, data:, vbscript:, etc. dès l'édition.
      isAllowedUri: (url, { defaultValidate, defaultProtocol }) => {
        if (!defaultValidate(url)) return false;
        try {
          const parsed = new URL(
            url,
            /^[a-z][a-z0-9+.-]*:/i.test(url) ? undefined : `${defaultProtocol}://x`
          );
          return SAFE_PROTOCOLS.includes(parsed.protocol.replace(":", ""));
        } catch {
          return false;
        }
      },
    },
  }),
  Image.configure({ inline: false, allowBase64: false }),
];
