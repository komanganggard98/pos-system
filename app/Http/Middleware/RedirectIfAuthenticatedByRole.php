<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            return match ($request->user()->role) {
                'admin'   => redirect()->route('dashboard'), // atau redirect('/dashboard')
                'cashier' => redirect()->route('pos.index'),       // atau redirect('/pos')
                default   => redirect('/dashboard'),
            };
        }

        return $next($request);
    }
}
