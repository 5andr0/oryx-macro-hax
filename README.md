# Ergodox Macro Hax

This is a quick and dirty script to nicely get around the annoying (though reasonable) limitation of Ergodox / Moonlander keyboards in the Oryx configurator where macros can only be 4 key sequences for security reasons.

This hack is a post-processor that'll take your raw "Source" Oryx configuration and extend your macros to be any arbitrary sequence.

# Complete configuration flow

## 0. Initial setup

To compile the firmware, setup the [ZSA QMK Fork with guide referenced](https://github.com/zsa/qmk_firmware)

`qmk setup zsa/qmk_firmware -b firmware21`

Install on the command line (with Node.js installed) using:
```
cd ~/qmk_firmware
git clone <your fork of this repo>
cd ergodox-macro-hax
npm install
```


## 1. Configuring with Oryx

Configure in Oryx just as you normally would, except make sure each macro you'd like to extend beyond 5 button presses is a unique set of alphanumeric button presses that act as a unique ID to find in post-processing.  Let's say you want a keyboard to type "whale", you could just write a macro with keys "whal" or get really detailed with numeric IDs and type "12345".  Remember these IDs for later.  DO NOT use any key modifiers, custom delays or non-alphanumeric keys in your extendable macros, you can specify those yourself later.

When done, take a note of the `layout hash ID` in the URL or download the source manually into the `keymap_src` folder.

It is also recommended to `git branch <your layout name>`.

## 2. Create a mapping in this script


```
cd ~/qmk_firmware/ergodox-macro-hax

npm run get -- <oryxLayoutHashId>
```

Grab my-macros.ts and change it to what you need. If you already downloaded your keymap and skipped `npm run get`, you have to unzip the keymap folder contents which contain keymap.c into ./layout_src or point the env var LAYOUT_DIR to the dir containing keymap.c. `npm run get` does this for you

Here's an example of creating an extended (more than 5 button) macro:

```
const macro = newMacro()
    .typeAlphanumeric("function") // Supports a-z and 0-9
    .sendRawCmd("SS_DELAY(100)") // Raw commands in the C file
    .tapKey("X_SPACE") // Tap a raw key code
    .delay(50) // Delay for 50 ms
```

Now just map the original 5 character macro to your newer, longer macro.  See what's already in my-macros.ts for fuller examples.

## 3. Run the post-processor

Run `npm run hax` to modify your config and extend your macros.
Run `npm run copy` to copy the processed keymap to the parent keymaps folder (keymaps/neo).

## 4. Build Modified Source and Flash it!

Use the normal QMK/ZSA Wally software to compile and flash.

`qmk compile -kb moonlander -km neo`

If you want Github to build the firmware for you, create repository action secret `LAYOUT_ID`, set it to the hashId of your layout keymap.
(Extract it from your ORYX link: `https://configure.zsa.io/moonlander/layouts/<hashId>/latest/0`) then you can use [Github Actions](./.github/workflows/process.yml) to build the firmware for you.

## Note: Figuring out key codes

I'm too lazy to list them for you, when I need a keycode such as "X_SPACE", I just put it in a macro and find it in the keymap.c file, then reference that name from then on out.
