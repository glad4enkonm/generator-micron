using System;
using System.Data.SqlClient;

namespace Core.Helper
{
    public static class SqlHelper
    {
        public static T QueryUsingConnection<T>(this string connectionString, Func<SqlConnection,T> query)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                return query(connection);
            }
        }
    }
}
