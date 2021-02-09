using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        //well generate a query of the type Irequest which is a mediatr interface
        //which returns a list of the type activity
        public class Query : IRequest<List<Activity>> { }

        //handler of the type Irequest that takes in query and returns a list of activities
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;

            //constructor for getting in the datacontext from persistence
            public Handler(DataContext context)
            {
                _context = context;

            }

            //the handler function
            public async Task<List<Activity>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                //gets a list of our activities and returns them
                var activities = await _context.Activities.ToListAsync();

                return activities;
            }
        }
    }
}