using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<Unit> Handle(Command request,
                CancellationToken cancellationToken)
            {

                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                //if there is no activity and nothing to be sent
                if (activity == null)
                    //throw an exception to stop it from being sent to the db
                    throw new Exception("Could not find activity");

                //get the Activities profile and map it to activity
                _mapper.Map(request.Activity, activity);

                //send an asynchronus request with the data to the db
                //if there were more than 0 new items saved then return an int value to success variable
                var success = await _context.SaveChangesAsync() > 0;

                //if success then return 200 response to controller
                if (success) return Unit.Value;

                //if unsuccessfull then return a problem message.
                throw new System.Exception("Problem saving changes");
            }
        }
    }
}
