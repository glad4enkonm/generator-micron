using Google.Protobuf.Collections;
using System;
using System.Collections.Generic;

namespace Core.Helper
{
    public static class GrpcHelperExtensions
    {
        public static TResp Construct<TResp, TRepeated>(this IEnumerable<TRepeated> collection, 
            Func<TResp, RepeatedField<TRepeated>> getRepeated) where TResp : new()
        {
            var result = new TResp();
            var repeatedFiled = getRepeated(result);
            repeatedFiled.AddRange(collection);
            return result;
        }     
    }
}
