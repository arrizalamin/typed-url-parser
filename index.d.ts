type Param<T extends string> = ["Param", T];
type Option<T extends Pattern[]> = ["Option", T];

type Pattern = string | Param<string> | Option<Pattern[]>;

export type Parse<
  Raw extends string,
  Parsed extends Pattern[] = []
> = Raw extends ""
  ? Parsed
  : Raw extends `(${infer rest}`
  ? rest extends `${infer inside})${infer outside}`
    ? Parse<outside, [...Parsed, Option<Parse<inside>>]>
    : never
  : Raw extends `:${infer pattern}/${infer rest}`
  ? Parse<`/${rest}`, [...Parsed, Param<pattern>]>
  : Raw extends `:${infer pattern}`
  ? [...Parsed, Param<pattern>]
  : Raw extends `${infer path}:${infer rest}`
  ? [...Parsed, ...Parse<path>, ...Parse<`:${rest}`>]
  : Raw extends `${infer path}(${infer rest}`
  ? [...Parsed, ...Parse<path>, ...Parse<`(${rest}`>]
  : [...Parsed, Raw];

export function parse<Raw extends string>(pattern: Raw): Parse<Raw>;

export type Match<
  Patterns extends Pattern[],
  Raw extends string
> = Patterns extends []
  ? Raw extends ""
    ? true
    : false
  : Patterns extends [infer P, ...infer RestPattern]
  ? RestPattern extends Pattern[]
    ? P extends string
      ? Raw extends `${P}${infer Rest}`
        ? Match<RestPattern, Rest>
        : false
      : P extends ["Param", string]
      ? Raw extends `${string}/${infer rest}`
        ? Match<RestPattern, `/${rest}`>
        : Match<RestPattern, "">
      : P extends ["Option", infer Ps]
      ? Ps extends Pattern[]
        ? true extends Match<[...Ps, ...RestPattern], Raw>
          ? true
          : Match<RestPattern, Raw>
        : never
      : never
    : never
  : never;

export function match<Patterns extends Pattern[], Raw extends string>(
  pattern: Patterns,
  string: Raw
): Match<Patterns, Raw>;

export type Apply<
  Patterns extends Pattern[],
  Keys extends { [key: string]: string },
  Result extends string = ""
> = Patterns extends []
  ? Result
  : Patterns extends [infer P, ...infer RestPattern]
  ? RestPattern extends Pattern[]
    ? P extends string
      ? Apply<RestPattern, Keys, `${Result}${P}`>
      : P extends ["Param", infer param]
      ? param extends `${infer param_}`
        ? param_ extends keyof Keys
          ? Apply<RestPattern, Keys, `${Result}${Keys[param]}`>
          : never
        : never
      : P extends ["Option", infer Ps]
      ? Ps extends Pattern[]
        ? Apply<[...Ps, ...RestPattern], Keys, Result> extends never
          ? Apply<RestPattern, Keys, Result>
          : Apply<[...Ps, ...RestPattern], Keys, Result>
        : never
      : never
    : never
  : never;

export function apply<
  Patterns extends Pattern[],
  Keys extends { [key: string]: string }
>(patterns: Patterns, keys: Keys): Apply<Patterns, Keys>;
