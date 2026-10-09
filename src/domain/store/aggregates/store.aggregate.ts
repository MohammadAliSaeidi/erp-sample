import { Aggregate as AggregateBase, AggregateId, createAggregateFactory } from "@/src/domain/core/entity";
import { DomainRequiredFieldError } from "@/src/domain/core/errors/validation.error";
export namespace Store {
  export type Data = Readonly<{ name: string; slug: string }>;
  export type Tag = "Store"; export type Aggregate = AggregateBase<Data, Tag>; export type Id = AggregateId<Tag>;
  export const factory = createAggregateFactory<Data, Aggregate, Tag>({ tag: "Store", validate: (p) => { const i = []; if (!p.name.trim()) i.push(new DomainRequiredFieldError("name")); if (!p.slug.trim()) i.push(new DomainRequiredFieldError("slug")); return i; }, build: (id, p) => ({ id, name: p.name.trim(), slug: p.slug.trim().toLowerCase() }) });
  export const create = (p: Data): Aggregate => factory.create(p);
  export const rehydrate = (p: Data & { id: Id }): Aggregate => factory.fromPersistence(p);
}
