
namespace gm2.control{
    export abstract class validation_base{
        public abstract isValid ( data: any ): boolean;
        public abstract invalidText( field: string ): string;
    }
}