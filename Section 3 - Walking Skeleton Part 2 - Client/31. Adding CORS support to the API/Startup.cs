using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
          //inject our configuration into our startup
          //runs the appsettings.json files
           Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
              opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            //add cors (cross origin policy) so that the frontend can call the api
            services.AddCors(opt =>
            {   
                //add the policy
                /**
                * @param nickname
                * @param the policy itself.
                */
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    // alow headers and methods from the origin of .....
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            //adds the controllers to the application
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //redirect any http requests to https
            //app.UseHttpsRedirection();

            //middleware to deal with routing of requests
            app.UseRouting();

            //middleware for authentication
            app.UseAuthorization();

            //add middleware for CORS
            app.UseCors("CorsPolicy");

            //map controller endpoints into our api
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
