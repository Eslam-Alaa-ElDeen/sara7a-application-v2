

export const Validation = (schema)=>{
    return (req, res, next) => {
        const arrError=[];
        for(const key of Object.keys(schema)){
            const { error } = schema[key].validate(req[key], {
                abortEarly: false
            });

            if(error){
                error.details.forEach((err)=>{
                    arrError.push({
                        message:err.message,
                        path:err.path[0],
                        key
                    })
                })
            }
        }

        if(arrError.length)
            return res.status(400).json({messsage:"validation error",arrError})

        next();
    };
}


