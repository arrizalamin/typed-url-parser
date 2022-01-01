import { expectType } from "tsd";
import { apply, match, parse } from ".";

expectType<[]>(parse(""));
expectType<[["Param", "param"], "/path"]>(parse(":param/path"));

expectType<["/path/test/", ["Param", "pattern"]]>(parse("/path/test/:pattern"));

expectType<["/path"]>(parse("/path"));

expectType<["/project/", ["Param", "projectID"], "/app/", ["Param", "appID"]]>(
  parse("/project/:projectID/app/:appID")
);

expectType<[["Option", ["/path"]]]>(parse("(/path)"));
expectType<["/path/", ["Option", ["/path"]], "/", ["Param", "param"]]>(
  parse("/path/(/path)/:param")
);
expectType<[["Option", ["/path/", ["Param", "param"], "/path"]], "/path"]>(
  parse("(/path/:param/path)/path")
);

expectType<true>(match(parse("/test"), "/test"));
expectType<false>(match(parse("/abc"), "/def"));

expectType<true>(match(parse("/:param"), "/abc"));
expectType<true>(match(parse("/:param/path"), "/abc/path"));
expectType<false>(match(parse("/:param/path"), "/path"));
expectType<false>(match(parse("/:test/path"), "/abc/def"));

expectType<true>(match(parse("path/:param"), "path/abc"));
expectType<true>(match(parse("path/:param"), "path/def"));
expectType<true>(match(parse("path/:param/path"), "path/ab/path"));

expectType<true>(match(parse("(/path)/test"), "/test"));
expectType<true>(match(parse("(/path)/test"), "/path/test"));
expectType<true>(match(parse("(/path/:param)/test"), "/test"));
expectType<true>(match(parse("(/path/:param)/test"), "/path/abc/test"));

expectType<"/path/path2">(apply(parse("/path/path2"), {} as const));
expectType<"/path/path2">(
  apply(parse("/path/path2"), { param: "abc" } as const)
);
expectType<"/path/path2">(
  apply(parse("(/path)/path2"), { param: "abc" } as const)
);
expectType<"/path/abc">(
  apply(parse("/path/:param"), { param: "abc" } as const)
);
expectType<never>(apply(parse("/path/:param"), {} as const));
expectType<"/path/abc/test">(
  apply(parse("(/path/:param)/test"), { param: "abc" } as const)
);
expectType<"/test">(apply(parse("(/path/:param)/test"), {} as const));
