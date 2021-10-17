import { Lens, Optional } from 'monocle-ts';
import { some, none } from 'fp-ts/Option';
import { idOpt } from '../optics';

import { Division, Strategy } from '../Division/Polymorphic';

/**
 * Focus on a `Division` in a `Strategy`.
 *
 * **Warning!** If the `Strategy` is not `'Manual'`, this will synthesize a
 * `Division`, which may not match the one calculated from the whole model.
 *
 * @category Strategy
 */
export const strategyDivision = <A,B>(): Lens<Strategy<A,B>, Division<A,B>> => new Lens(
    (s) => { switch (s.Strategy) {
        case 'Manual': return s.Division;
        case 'Minimal': return { Division: 'Whole', Info: s.Info };
    }},
    (a) => (s) => { switch (s.Strategy) {
        case 'Manual': return { Strategy: 'Manual', Division: a};
        case 'Minimal': return { Strategy: 'Manual', Division: a};
    }}
);

/**
 * Focus on a child `Division`, given it's index.
 *
 * @category Division
 */
export const divisionDivision = <A,B>(is: DivisionStep[]): Optional<Division<A,B>, Division<A,B>> =>
    is.reduce((a, i) => a.compose(divisionDivisionStep<A,B>(i)), idOpt<Division<A,B>>());

/**
 * Focus on an immediate child `Division`, given it's index.
 *
 * @category Division
 */
export const divisionDivisionStep = <A,B>(i: DivisionStep) => new Optional<Division<A,B>, Division<A,B>>(
    (s) => s.Division === 'Divided' ? some(s[i]) : none,
    (a) => (s) => s.Division === 'Divided' ? {...s, [i]: a} : s
);

/**
 * A single step of an index of a `Division`.
 *
 * @category Division
 */
export type DivisionStep = 'Left' | 'Right';
