import { newMacro, processAll } from "./macros";

// Point this at wherever your config root folder is
const SOURCE_DIR = (process.env.LAYOUT_DIR || './layout_src') + "/keymap.c";

const macroExtensions = {

    "await": newMacro()
        .typeAlphanumeric("await "),
    "async": newMacro()
        .typeAlphanumeric("async "),
    "stati": newMacro()
        .typeAlphanumeric("static "),
		
    "retur": newMacro()
        .typeAlphanumeric("return"),
    "publi": newMacro()
        .typeAlphanumeric("public "),
    "priva": newMacro()
        .typeAlphanumeric("private "),
    "class": newMacro()
        .typeAlphanumeric("class "),
    "using": newMacro()
        .typeAlphanumeric("using "),
    "excep": newMacro()
        .typeAlphanumeric("Exception "),
    "forea": newMacro()
        .typeAlphanumeric("foreach"),
}

processAll(macroExtensions, SOURCE_DIR)
