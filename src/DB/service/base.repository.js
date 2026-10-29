export const create=async({model,data,options={}}={})=>{
    return await model.create([data],options)
}
export const findOne=async({model,filter,options={}}={})=>{
    return await model.findOne(filter,options)
}

export const find=async({model,filter,options={}}={})=>{
    let query= model.find(filter)

    if(options?.limit) query.limit(options?.limit)
    if(options?.skip) query.skip(options?.skip)
    if(options?.sort) query.sort(options?.sort)
    if(options?.populate) query.populate(options?.populate)

    await query.exec();
}
export const findById=async({model,ID,options={}}={})=>{
    return await model.findById(ID,options)
}

export const findOnedAndUpdate=async({model,filter,update,options={}}={})=>{
    return await model.findOneAndUpdate(filter,update,{returnDocument:"after",...options})
}